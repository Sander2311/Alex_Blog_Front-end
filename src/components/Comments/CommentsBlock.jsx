import React from "react";

import { Comment } from './Comment';
import { SideBlock } from "../SideBlock";
import Divider from "@mui/material/Divider";

import List from "@mui/material/List";

export const CommentsBlock = ({ items, children, isLoading = true, postId, isHomePage = false, comentStatus, setComentStatus }) => {

  return (
    <SideBlock title="Comments">
      <List>
        {(isLoading ? [...Array(5)] : items).map((obj, index) => (
          <React.Fragment key={index}>
            <Comment
              commentId={obj?._id}
              user={obj?.user}
              text={obj?.text}
              isLoading={isLoading}
              isHomePage={isHomePage}
              postId={postId}
              comentStatus={comentStatus}
              setComentStatus={setComentStatus}
            />
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
