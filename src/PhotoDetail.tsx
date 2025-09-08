import { Link, useParams } from "react-router-dom";
import { usePhotosStore } from "./store/photosStore";

const PhotoDetail = () => {
  const { photoId } = useParams<{ photoId: string }>();
  const photo = usePhotosStore((s) => s.photos.find((p) => p.id === photoId));

  if (!photo) {
    return (
      <div style={{ padding: 20 }}>
        <p>Photo not found.</p>
        <Link to="/">← Back to Albums</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{photo.title}</h1>
      <img
        src={photo.url}
        alt={photo.title}
        style={{ maxWidth: "100%", borderRadius: "8px" }}
      />
      {photo.description && <p>{photo.description}</p>}
      <div style={{ marginTop: 20 }}>
        <Link to={`/albums/${photo.albumId}`}>← Back to Album</Link>
      </div>
    </div>
  );
};

export default PhotoDetail;
