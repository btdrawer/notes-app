export type Note = {
  id: string;
  title: string;
  text: string;
  userId: string;
};

export type CreateNote = {
  title: string;
  text: string;
};
