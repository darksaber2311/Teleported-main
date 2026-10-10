const Sidebar = ({ activeTab, setActiveTab, wishlist, visited }) => {
  let data = [];

  if (activeTab === "wishlist") {
    data = wishlist;
  } else if (activeTab === "visited") {
    data = visited;
  } else {
    data = [];
  }

  return (
    <div className="sidebar">
      <div className="sidebar-tabs">
        <div
          className={`tab ${activeTab === "wishlist" ? "active" : ""}`}
          onClick={() => setActiveTab("wishlist")}
        >
          wishlist
        </div>

        <div
          className={`tab ${activeTab === "visited" ? "active" : ""}`}
          onClick={() => setActiveTab("visited")}
        >
          archive
        </div>

        <div
          className={`tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          profile
        </div>
      </div>

      <div className="sidebar-content">
        {activeTab === "profile" ? (
          <div></div>
        ) : data.length === 0 ? (
          <p>No places yet :{'('}</p>
        ) : (
          data.map((place) => (
            <div key={place._id} className="card">
              <div className="image-placeholder">Image</div>
              <h4>{place.name}</h4>
              <p>{place.state}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;