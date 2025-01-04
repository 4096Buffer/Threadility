import { useEffect } from "react";
import React from "react";

function CommentForm() {
    return (
        <>
            <div className="comment-post-container">
                <form method="post">
                    <label htmlFor="comment-post-text">Twój komentarz</label>
                    <input type="text" id="comment-post-text"/>
                    <input type="submit" id="comment-post-submit"/>
                </form>
            </div>
        </>
    )
}
 
export default CommentForm;