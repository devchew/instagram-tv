export interface Response {
  result: Result;
}

export interface Result {
  edges: Edge[];
  page_info: PageInfo;
  version: string;
}

export interface Edge {
  node: Node;
  cursor: string;
}

export interface Node {
  code: string;
  pk: string;
  id: string;
  ad_id: null;
  boosted_status: null;
  boost_unavailable_identifier: null;
  boost_unavailable_reason: null;
  caption: Caption | null;
  caption_is_edited: boolean;
  feed_demotion_control: null;
  feed_recs_demotion_control: null;
  taken_at: number;
  inventory_source: null;
  video_versions: Candidate[] | null;
  is_dash_eligible: number | null;
  number_of_qualities: number | null;
  video_dash_manifest: null | string;
  image_versions2: ImageVersions2;
  sharing_friction_info: SharingFrictionInfo;
  is_paid_partnership: boolean;
  sponsor_tags: null;
  affiliate_info: null;
  original_height: number;
  original_width: number;
  organic_tracking_token: string;
  link: null;
  story_cta: null;
  user: User;
  group: null;
  owner: Owner;
  coauthor_producers: any[];
  invited_coauthor_producers: any[];
  follow_hashtag_info: null;
  title: null;
  comment_count: number;
  comments_disabled: null;
  commenting_disabled_for_viewer: null;
  like_and_view_counts_disabled: boolean;
  has_liked: boolean;
  top_likers: any[];
  facepile_top_likers: any[];
  like_count: number;
  preview: null;
  can_see_insights_as_brand: boolean;
  social_context: null;
  view_count: number | null;
  can_reshare: null;
  can_viewer_reshare: boolean;
  ig_media_sharing_disabled: boolean;
  photo_of_you: null;
  product_type: ProductType;
  media_type: number;
  usertags: null;
  media_overlay_info: null;
  carousel_parent_id: null;
  carousel_media_count: null;
  carousel_media: null;
  location: null;
  has_audio: boolean | null;
  clips_metadata: ClipsMetadata | null;
  clips_attribution_info: null;
  accessibility_caption: null;
  audience: null;
  display_uri: null;
  media_cropping_info: null;
  profile_grid_thumbnail_fitting_style: ProfileGridThumbnailFittingStyle;
  thumbnails: Thumbnails | null;
  timeline_pinned_user_ids: any[];
  upcoming_event: null;
  logging_info_token: null;
  explore: null;
  main_feed_carousel_starting_media_id: null;
  is_seen: null;
  open_carousel_submission_state: null;
  previous_submitter: null;
  all_previous_submitters: null;
  headline: null;
  comments: null;
  fb_like_count: number | null;
  saved_collection_ids: null;
  has_viewer_saved: null;
  media_level_comment_controls: null;
  __typename: NodeTypename;
}

export enum NodeTypename {
  XDTMediaDict = "XDTMediaDict",
}

export interface Caption {
  has_translation: boolean;
  created_at: number;
  pk: string;
  text: string;
}

export interface ClipsMetadata {
  audio_type: string;
  achievements_info: AchievementsInfo;
  music_info: null;
  original_sound_info: OriginalSoundInfo | null;
}

export interface AchievementsInfo {
  show_achievements: boolean;
}

export interface OriginalSoundInfo {
  original_audio_title: string;
  should_mute_audio: boolean;
  audio_asset_id: string;
  consumption_info: ConsumptionInfo;
  ig_artist: IgArtist;
  is_explicit: boolean;
}

export interface ConsumptionInfo {
  is_trending_in_clips: boolean;
  should_mute_audio_reason: string;
  should_mute_audio_reason_type: null;
}

export interface IgArtist {
  username: Username;
  id: string;
}

export enum Username {
  RynekKawiarniaGaleria = "rynek_kawiarnia_galeria",
}

export interface ImageVersions2 {
  candidates: Candidate[];
}

export interface Candidate {
  url: string;
  height: number;
  width: number;
  url_wrapped: string;
  type?: number;
}

export interface Owner {
  pk: string;
  profile_pic_url: string;
  username: Username;
  friendship_status: FriendshipStatus;
  is_embeds_disabled: boolean;
  is_unpublished: boolean;
  is_verified: boolean;
  show_account_transparency_details: boolean;
  supervision_info: null;
  transparency_product: null;
  transparency_product_enabled: boolean;
  transparency_label: null;
  ai_agent_owner_username: null;
  id: string;
  __typename: OwnerTypename;
  is_private: boolean;
}

export enum OwnerTypename {
  XDTUserDict = "XDTUserDict",
}

export interface FriendshipStatus {
  following: boolean;
  is_bestie: boolean;
  is_feed_favorite: boolean;
  is_restricted: boolean;
}

export enum ProductType {
  Clips = "clips",
  Feed = "feed",
}

export enum ProfileGridThumbnailFittingStyle {
  Unset = "UNSET",
}

export interface SharingFrictionInfo {
  bloks_app_url: null;
  should_have_sharing_friction: boolean;
}

export interface Thumbnails {
  sprite_height: number;
  sprite_urls: string[];
  sprite_width: number;
}

export interface User {
  pk: string;
  username: Username;
  profile_pic_url: string;
  is_private: boolean;
  is_embeds_disabled: boolean;
  is_unpublished: boolean;
  is_verified: boolean;
  friendship_status: FriendshipStatus;
  latest_besties_reel_media: number;
  latest_reel_media: number;
  live_broadcast_visibility: null;
  live_broadcast_id: null;
  seen: null;
  supervision_info: null;
  id: string;
  hd_profile_pic_url_info: HDProfilePicURLInfo;
  full_name: FullName;
  __typename: OwnerTypename;
  profile_pic_url_wrapped: string;
}

export enum FullName {
  RynekKawiarniaGaleria = "Rynek Kawiarnia Galeria",
}

export interface HDProfilePicURLInfo {
  url: string;
  url_wrapped: string;
}

export interface PageInfo {
  end_cursor: string;
  has_next_page: boolean;
  has_previous_page: boolean;
  start_cursor: null;
}
