export default function AnnouncementBar({ message = '🇳🇵 Handcrafted in Nepal — FREE Delivery on orders over $100' }) {
  return (
    <div className="announcement" role="note">
      {message}
    </div>
  );
}
