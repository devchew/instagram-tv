import fetch from "node-fetch";
import { processLog } from "./log";
import { Response } from "./apiType";

const url = "https://instagram120.p.rapidapi.com/api/instagram/posts";

type Post = {
  caption: string;
  id: string;
  media_url: string;
  likes: number;
  timestamp: string;
};

const processResponse = (response: Response): Post[] => {
  return response.result.edges.map((edge) => ({
    caption: edge.node.caption?.text || "",
    id: edge.node.id,
    media_url: edge.node.image_versions2.candidates[0].url,
    likes: edge.node.like_count,
    timestamp: edge.node.taken_at.toString(),
  }));
};

export const fetchPosts = (rapidApiKey: string) =>
  fetch(url, {
    headers: {
      "x-rapidapi-host": "instagram120.p.rapidapi.com",
      "x-rapidapi-key": rapidApiKey,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      username: "rynek_kawiarnia_galeria",
      maxId: "",
    }),
  })
    .then((res) => res.json())
    .then((json: Response) => processResponse(json))
    .catch((err) => {
      processLog.error("error fetching posts", err);
      throw err;
    });
