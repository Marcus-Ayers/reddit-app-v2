import React from 'react';

const Comments = ({
  comment,
  authenticated,
  username,
  editingCommentId,
  openDropdownId,
  handleChange,
  handleSubmit,
  startEditing,
  toggleDropdown,
  saveComment,
  removeComment,
}) => {


return (
  <div className="row">
  <div className="col-7 post-background">
    <div className="form-group form-bottom-border">
      <form onSubmit={handleSubmit}>
        <label className='comment-header' htmlFor="title">Comment as 
          <span className="username-color ml-1">
            {username}
          </span>
        </label>
        <div className="comment-box">
          <textarea type='text' className='form-control text-white no-border' id='title' name='body' placeholder='What are your thoughts?' rows='5' value={body} onChange={handleChange} />
          <div className="comment-tools">
            <button className='btn btn-light comment-button' type='submit'>Submit</button>
          </div>
        </div>
      </form>
    </div>
    {/* MAPS THROUGH ALL THE COMMENTS FOR THE POST */}
    {comment.map((comment, index) => {
      const isEditing = editingCommentId === comment?.id;
      return (
        <div key={comment?.id || index} className="">
          <div className="container">
            <div className="row comment-container">
              {/* <div className="p-0">
                <img src="https://www.redditstatic.com/desktop2x/img/id-cards/snoo-home@2x.png" className="comment-image"></img>
              </div> */}
              <div className="col p-0">
                <div className="icon-name-container">
              <img src="https://www.redditstatic.com/desktop2x/img/id-cards/snoo-home@2x.png" className="comment-image"></img>

                <a className='d-flex align-items-center' href={`/user/${comment?.user?.id}`}>
                  <p className="comment-username">u/{comment?.user?.username}</p>
                </a>
                </div>
                {isEditing ? (
                  <div className="editing-container">
                    <textarea className="form-control text-white" id={`comment-${comment.id}`} defaultValue={comment?.body} rows='5' onBlur={(e) => saveComment(comment?.id, e.target.value)} />
                  <div className="comment-tools">
                  {isEditing && (
                    <button
                      className="btn btn-light comment-button save-comment-button" onClick={() =>
                        saveComment(comment?.id, document.querySelector(`#comment-${comment.id}`).value)}>Save
                    </button>
                  )}
                  </div>
                  </div>
                ) : (
                  <p className="comment">{comment?.body}</p>
                )}
              </div>
              {username === comment?.user?.username && (
                <>
                  <div className="dropdown">
                    {!isEditing && (
                      <i className="fas fa-ellipsis-v toggle-button" onClick={() => toggleDropdown(comment.id)}></i>
                    )}
                    {openDropdownId === comment.id && (
                      <div className="dropdown-menu">
                        <a className="dropdown-item" onClick={() => {startEditing(comment?.id); setOpenDropdownId(null)}}>Edit </a>
                        <a className="dropdown-item" onClick={() => {removeComment(comment?.id); setOpenDropdownId(null)}}> Delete </a>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>
)
};


export default Comments;
