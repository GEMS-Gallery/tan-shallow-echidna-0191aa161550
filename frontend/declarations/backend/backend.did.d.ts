import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Comment {
  'content' : string,
  'username' : string,
  'createdAt' : bigint,
}
export interface Post {
  'id' : bigint,
  'content' : string,
  'username' : string,
  'createdAt' : bigint,
  'likes' : bigint,
  'category' : string,
  'image' : [] | [string],
  'comments' : Array<Comment>,
  'avatar' : string,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export interface _SERVICE {
  'addComment' : ActorMethod<[bigint, string, string], Result>,
  'createPost' : ActorMethod<
    [string, [] | [string], string, string, string],
    Result_1
  >,
  'getPosts' : ActorMethod<[[] | [string]], Array<Post>>,
  'likePost' : ActorMethod<[bigint], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
