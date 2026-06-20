import React, { useState } from "react";

const Comments = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const commentObj = { text: newComment, id: Date.now() };
    setComments([...comments, commentObj]);
    setNewComment("");
  };

  return (
    <div className="mt-12 border-t border-neutral-800 pt-8">
      <h3 className="text-xl font-bold mb-4">Comments</h3>
      <div className="flex gap-2 mb-6">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 bg-[#09090B] border border-neutral-800 rounded-lg p-2 text-white"
          placeholder="Write a comment..."
        />
        <button
          onClick={handleAddComment}
          className="bg-indigo-600 px-4 py-2 rounded-lg text-white font-medium"
        >
          Post
        </button>
      </div>
      <div className="space-y-4">
        {comments.map((c) => (
          <div
            key={c.id}
            className="bg-[#09090B] p-4 rounded-lg text-neutral-300"
          >
            {c.text}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Comments;
