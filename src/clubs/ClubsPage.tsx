import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuthToken } from "../scripts";
import styles from "./clubsPage.module.css";

type Club = {
  _id: string;
  name: string;
  description: string;
  role: string; // "Owner" or "Member"
};

const ClubsPage: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClubs = async () => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error("No token found");

      const response = await fetch("http://localhost:3000/api/club/my-clubs", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch clubs");

      const data: Club[] = await response.json();
      setClubs(data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  if (loading) return <p>Loading clubs...</p>;

  return (
    <main className="container">
      <div className={styles.clubPage}>
        <h1>My Clubs</h1>
        {clubs.length > 0 ? (
          <ul>
            {clubs.map((club) => (
              <li
                key={club._id}
                style={{ marginBottom: "1rem" }}
                className={styles.clubCard}
              >
                <Link
                  to={`/club-library/${club._id}`}
                  className={styles.clubName}
                >
                  {club.name}
                </Link>

                <p className={styles.clubDescription}>
                  <strong>Description:</strong> {club.description}
                </p>
                <p>
                  <strong>Role:</strong> {club.role}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No clubs found.</p>
        )}
      </div>
    </main>
  );
};

export default ClubsPage;
