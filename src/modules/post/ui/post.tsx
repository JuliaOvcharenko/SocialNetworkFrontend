import React from 'react';
import { View } from 'react-native';
import { IPost } from '../types/post.types'; 

import { styles } from './post.styles'; 
import { PostHeader } from './components/header/post-header';
import { PostFooter } from './components/footer/post-footer';
import { PostContent } from './components/content/post-content';
import { PostGallery } from './components/gallery/post-gallery';

interface PostProps {
    post: IPost;
}

export function Post({ post }: PostProps) {
    return (
        <View style={styles.postContainer}>
            <PostHeader author={post.author} />
            
            <PostContent title={post.title} text={post.text} tags={post.tags} />
            
            <PostGallery images={post.images} />
            <PostFooter 
                likes={post.likesCount} 
                views={post.viewsCount} 
                isLiked={post.isLikedByMe} 
            />
        </View>
    );
}