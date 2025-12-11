export interface Testimonial {
  _id: string;
  name: string;
  country: string;
  university: string;
  message: string;
  rating: number;
  image?: {
    url: string;
    public_id?: string;
  };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
