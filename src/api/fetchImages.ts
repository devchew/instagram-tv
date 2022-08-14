import { PostProps } from '../components/Post';

export const fetchImages: Promise<PostProps[]> =
    Promise.resolve([{
        id: 'dupa',
        date: Date.now(),
        caption: 'test',
        likes: 6,
        image: 'https://picsum.photos/800/600'
    }, {
        id: 'dupa2',
        date: Date.now(),
        caption: 'test2',
        likes: 8,
        image: 'https://picsum.photos/800/600'
    }])



