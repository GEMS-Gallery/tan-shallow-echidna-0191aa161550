import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Comment { 'content' : string, 'createdAt' : bigint }
export interface Post {
  'id' : bigint,
  'content' : string,
  'createdAt' : bigint,
  'likes' : bigint,
  'category' : [] | [string],
  'image' : [] | [string],
  'comments' : Array<Comment>,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export interface _SERVICE {
  'addComment' : ActorMethod<[bigint, string], Result>,
  'createPost' : ActorMethod<[string, [] | [string], [] | [string]], Result_1>,
  'getPosts' : ActorMethod<[], Array<Post>>,
  'likePost' : ActorMethod<[bigint], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
