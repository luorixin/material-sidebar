import React, { memo } from "react";
import { connect } from "react-redux";

const _MaterialCard = memo(({ post = {}, actions }) => {
  const getDefaultImg = () => {
    if (!post.type) return null;
    switch (post.type) {
      case "ARTICLE":
      case "LINK":
        return post.image ? (
          <img src={post.image} alt={post.title}></img>
        ) : (
          <img src={post.image} alt={post.title}></img>
        );
      case "IMAGE":
        return post.image ? (
          <img src={post.image} alt={post.title}></img>
        ) : (
          <img src={post.url} alt={post.title}></img>
        );
      case "PPT":
      case "PDF":
      case "WORD":
      case "EXCEL":
        return post.image ? (
          <img src={post.image} alt={post.title}></img>
        ) : (
          <img src={post.image} alt={post.title}></img>
        );
      default:
        break;
    }
  };
  return (
    <div className="material-card">
      {getDefaultImg()}
      <div className="material-content">
        <div className="material-title">{post.title}</div>
        <div className="material-des">{post.description}</div>
      </div>
      <div className="material-action">{actions}</div>
    </div>
  );
});

const MaterialCard = connect((state) => {
  const { locale } = state.common;
  return {
    locale,
  };
})(_MaterialCard);

export default MaterialCard;
