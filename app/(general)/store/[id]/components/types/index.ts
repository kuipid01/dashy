
  export interface Review {
    id: string;
    author: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
  }
  
  export interface Filter {
    id: string;
    name: string;
    options: {
      value: string;
      label: string;
    }[];
  }