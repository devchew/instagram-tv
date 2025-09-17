import React, { FunctionComponent } from 'react';
import { formatDistance, differenceInDays } from "date-fns";
import locale from "date-fns/locale/pl";
import IgLogo from "./../assets/IgLogo.png";

export interface PostProps {
  caption: string;
  id: string;
  media_url: string;
  likes: number;
  timestamp: string;
  slideCorrupted: (id: string) => void;
}

const timestampToDate = (timestamp: string): Date =>
  new Date(parseInt(timestamp + "000", 10));

const Post: FunctionComponent<PostProps> = ({
  caption,
  id,
  media_url,
  likes,
  timestamp,
  slideCorrupted,
}) => {
  const now = new Date().getTime();
  const isNew = differenceInDays(timestampToDate(timestamp), now) < 7;
  const formattedDate = formatDistance(timestampToDate(timestamp), new Date(), {
    locale,
  });

  return (
    <article
      className={["instagram-item", isNew ? "instagram-item--new" : ""].join(
        " "
      )}
      key={id}
    >
      <header className="instagram-item__header">
        <span className="instagram-item__author">
          <img
            src={IgLogo}
            alt="userPhoto"
            className="instagram-item__author-image"
          />
          <span className="instagram-item__author-name">Instagram</span>
        </span>
      </header>
      <figure className="instagram-item__figure">
        <img
          src={media_url}
          alt=""
          className="instagram-item__figure-image"
          onError={slideCorrupted.bind(this, id)}
        />
        <figcaption className="instagram-item__figure-caption">
          {caption}
        </figcaption>
      </figure>
      <footer className="instagram-item__footer">
        <section className="instagram-item__footer-likes">
          <i className="heart icon" /> {likes}
        </section>
        <section className="instagram-item__footer-date">
          <i className="clock icon" /> {formattedDate}
        </section>
      </footer>
    </article>
  );
};

export default Post;
