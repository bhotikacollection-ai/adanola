export default function AnnouncementBar({ message = 'FREE Standard Delivery on orders over €125' }) {
  return (
    <div className="announcement" role="note">
      {message}
    </div>
  );
}
