import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuthToken } from "../scripts";
import BookGrid from "../components/bookGrid/BookGrid";
import { Book } from "../types/types";
import styles from "./clubLibrary.module.css";

interface Club {
  _id: string;
  name: string;
  description: string;
  owner: {
    _id: string;
    username: string;
  };
  members: { _id: string; username: string }[];
}

const ClubLibrary: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate(); // Use navigate to handle page navigation
  const [club, setClub] = useState<Club | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await getAuthToken();

        // Fetch club details
        const clubResponse = await fetch(
          `http://localhost:3000/api/club/${clubId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!clubResponse.ok) {
          throw new Error("Failed to fetch club details");
        }

        const clubData: Club = await clubResponse.json();
        setClub(clubData);

        // Fetch library books
        const libraryResponse = await fetch(
          `http://localhost:3000/api/club/${clubId}/library`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!libraryResponse.ok) {
          throw new Error("Failed to fetch library books");
        }

        const libraryBooks: Book[] = await libraryResponse.json();
        setBooks(libraryBooks);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (clubId) {
      fetchClubDetails();
    }
  }, [clubId]);

  const handleBookClick = (bookId: string) => {
    navigate(`/clubs/${clubId}/books/${bookId}`); // Navigate to ClubBook page with bookId
  };

  if (loading) {
    return <p>Loading club data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!club) {
    return <p>Club not found.</p>;
  }

  return (
    <main className="container">
      <div className={styles.clubPage}>
        <section className="club-details">
          <h1>{club.name}</h1>
          <p>{club.description}</p>
          <p>
            <strong>Owner:</strong> {club.owner.username}
          </p>
        </section>

        <section className={styles.clubMember}>
          <h2>Members</h2>
          <ul>
            {club.members.map((member) => (
              <li key={member._id} className={styles.member}>
                {member.username}
              </li>
            ))}
          </ul>
        </section>

        <section className="club-library">
          <h2>Library</h2>
          <BookGrid books={books} onAdd={handleBookClick} />
        </section>
      </div>
    </main>
  );
};

export default ClubLibrary;
