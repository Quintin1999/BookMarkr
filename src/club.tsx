const ClubPage = () => {
    return (
        <>
        {/* <!-- Create Club --> */}
        <h2>Create Club</h2>
        <form id="createClubForm">
          <label htmlFor="name">Club Name:</label>
          <input type="text" name="name" id="name" required /><br />
    
          <label htmlFor="description">Description:</label>
          <input type="text" name="description" id="description" /><br />
    
          <label htmlFor="roomKey">Room Key:</label>
          <input type="text" name="roomKey" id="roomKey" required /><br />
    
          <button type="button" id="createClubButton">Create Club</button>
        </form>
    
        {/* <!-- Update Club --> */}
        <h2>Update Club</h2>
        <div id="updateClubContainer">
          <button type="button" id="selectClubToUpdateButton">
            Select Club to Update
          </button>
        </div>
        <form id="updateClubForm" style={{"display": "none"}}>
          <label htmlFor="updateName">New Club Name:</label>
          <input type="text" id="updateName" name="name" /><br />
    
          <label htmlFor="updateDescription">New Description:</label>
          <input type="text" id="updateDescription" name="description" /><br />
    
          <label htmlFor="updateRoomKey">New Room Key:</label>
          <input type="text" id="updateRoomKey" name="roomKey" /><br />
    
          <button type="button" id="updateClubButton">Update Club</button>
        </form>
    
        {/* <!-- Delete Club --> */}
        <h2>Delete Club</h2>
        <div id="deleteClubContainer">
          <button type="button" id="selectClubToDeleteButton">
            Select Club to Delete
          </button>
        </div>
        </>
    )
  };
  
  export default ClubPage;