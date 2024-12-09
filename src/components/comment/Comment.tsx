import styles from "./comment.module.css";

const Comment = ({
  content,
  userId,
}: {
  content: string;
  userId: { _id: string; username: string };
}) => {
  return (
    <div className={styles.comment}>
      <p className={styles.username}>{userId.username}</p>
      <p className={styles.content}>{content}</p>
    </div>
  );
};
export default Comment;
