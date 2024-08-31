export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Comment = IDL.Record({ 'content' : IDL.Text, 'createdAt' : IDL.Int });
  const Post = IDL.Record({
    'id' : IDL.Nat,
    'content' : IDL.Text,
    'createdAt' : IDL.Int,
    'likes' : IDL.Nat,
    'category' : IDL.Opt(IDL.Text),
    'image' : IDL.Opt(IDL.Text),
    'comments' : IDL.Vec(Comment),
  });
  return IDL.Service({
    'addComment' : IDL.Func([IDL.Nat, IDL.Text], [Result], []),
    'createPost' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [Result_1],
        [],
      ),
    'getPosts' : IDL.Func([], [IDL.Vec(Post)], ['query']),
    'likePost' : IDL.Func([IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
