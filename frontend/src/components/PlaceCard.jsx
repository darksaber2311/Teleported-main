function PlaceCard({ name, description }) {
  return (
    <div className="card">
      <div className="image-placeholder">Image</div>
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  );
}

export default PlaceCard;