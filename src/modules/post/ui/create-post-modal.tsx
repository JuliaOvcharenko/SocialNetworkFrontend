import React, { useState, useRef } from 'react';
import { View, Text, Modal, ScrollView, KeyboardAvoidingView, Platform, Image, TextInput, Animated } from 'react-native';
import { Input } from '@shared/ui/input';
import { TextArea } from '@shared/ui/textarea/textarea';
import { styles } from './create-post-modal.styles';
import { Button } from '@shared/ui/button';
import { IMAGES } from '@shared/ui/images';

interface CreatePostModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export function CreatePostModal({ isVisible, onClose }: CreatePostModalProps) {
    const [title, setTitle] = useState('Природа, книга і спокій 🌿');
    const [topic, setTopic] = useState('');
    const [postText, setPostText] = useState('Інколи найкращі ідеї народжуються в тиші\nПрирода, книга і спокій — усе, що потрібно, аби перезавантажитись.');
    const [tags, setTags] = useState<string[]>(['#відпочинок', '#натхнення', '#життя', '#природа', '#читання', '#спокій', '#гармонія', '#музика', '#фільми', '#подорожі']);

    const [isAddingTag, setIsAddingTag] = useState(false);
    const [currentTag, setCurrentTag] = useState('');
    
    const [links, setLinks] = useState<string[]>(['https://www.instagram.com/world.it.acad...']);
    const [isAddingLink, setIsAddingLink] = useState(false);
    const [currentLink, setCurrentLink] = useState('');
    
    const [photos, setPhotos] = useState<any[]>([
        require('../../../assets/Frame1.png'),
        require('../../../assets/Frame2.png')
    ]);

    const scrollY = useRef(new Animated.Value(0)).current;
    const [scrollViewHeight, setScrollViewHeight] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);

    const SCROLL_THUMB_HEIGHT = 65;
    const trackHeight = scrollViewHeight - 20;
    const scrollableRange = contentHeight - scrollViewHeight;
    const thumbTravelRange = trackHeight - SCROLL_THUMB_HEIGHT;

    const scrollIndicatorPosition = scrollY.interpolate({
        inputRange: [0, scrollableRange > 0 ? scrollableRange : 1],
        outputRange: [0, thumbTravelRange > 0 ? thumbTravelRange : 0],
        extrapolate: 'clamp',
    });

    const handleAddTag = () => {
        if (currentTag.trim().length > 0) {
            const newTag = currentTag.startsWith('#') ? currentTag.trim() : `#${currentTag.trim()}`;
            if (!tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
        }
        setCurrentTag('');
        setIsAddingTag(false);
    };

    const handleAddLink = () => {
        if (currentLink.trim().length > 0) {
            setLinks([...links, currentLink.trim()]);
            setCurrentLink('');
            setIsAddingLink(false);
        }
    };

    const removePhoto = (indexToRemove: number) => {
        setPhotos(photos.filter((_, index) => index !== indexToRemove));
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.keyboardWrapper}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Створення публікації</Text>
                            <Button 
                                onPress={onClose}
                                icon={<IMAGES.XButton />}
                                style={{ backgroundColor: 'transparent', paddingHorizontal: 0, height: 'auto', width: 'auto', minHeight: 0 }}
                            />
                        </View>

                        <View style={styles.scrollWrapper}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollContent}
                                onLayout={(e) => setScrollViewHeight(e.nativeEvent.layout.height)}
                                onContentSizeChange={(_, h) => setContentHeight(h)}
                                onScroll={Animated.event(
                                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                    { useNativeDriver: false }
                                )}
                                scrollEventThrottle={16}
                            >
                                <Input label="Назва публікації" value={title} onChangeText={setTitle} />
                                <Input label="Тема публікації" placeholder="Напишіть тему публікації" value={topic} onChangeText={setTopic} />

                                <View style={styles.tagsContainer}>
                                    {tags.map((tag, index) => (
                                        <View key={index} style={styles.tagBadge}>
                                            <Text style={styles.tagText}>{tag}</Text>
                                        </View>
                                    ))}

                                    {!isAddingTag ? (
                                        <Button 
                                            variant="iconCircular"
                                            style={styles.circleIconButton}
                                            onPress={() => setIsAddingTag(true)}
                                            icon={<IMAGES.PlusButton />}
                                        />
                                    ) : (
                                        <View style={styles.addTagActiveWrapper}>
                                            <View style={styles.tagInputContainer}>
                                                <Text style={styles.hashtagPrefix}>#</Text>
                                                <TextInput
                                                    style={styles.inlineTagInput}
                                                    value={currentTag}
                                                    onChangeText={setCurrentTag}
                                                    autoFocus={true}
                                                />
                                            </View>
                                            <Button 
                                                variant="iconCircular"
                                                style={styles.circleIconButton}
                                                onPress={handleAddTag}
                                                icon={<IMAGES.CheckBoxTrue style={{ width: 16, height: 16 }} />} 
                                            />
                                        </View>
                                    )}
                                </View>

                                <TextArea value={postText} onChangeText={setPostText} />

                                <Text style={styles.inputLabel}>Посилання</Text>
                                
                                {links.map((item, index) => (
                                    <View key={index} style={styles.linkRow}>
                                        <View style={styles.linkInputWrapper}>
                                            <Input
                                                label=""
                                                value={item}
                                                editable={false}
                                            />
                                        </View>
                                        
                                        {!isAddingLink && index === links.length - 1 && (
                                            <View style={styles.linkActionButtons}>
                                                <Button 
                                                    variant="iconCircular"
                                                    style={styles.circleIconButton}
                                                    onPress={() => setIsAddingLink(true)}
                                                    icon={<IMAGES.PlusButton />}
                                                />
                                            </View>
                                        )}
                                    </View>
                                ))}

                                {(links.length === 0 || isAddingLink) && (
                                    <View style={styles.linkRow}>
                                        <View style={styles.linkInputWrapper}>
                                            <Input
                                                label=""
                                                value={currentLink}
                                                onChangeText={setCurrentLink}
                                                placeholder="Введіть посилання"
                                                autoFocus={isAddingLink}
                                            />
                                        </View>
                                        <View style={styles.linkActionButtons}>
                                            <Button 
                                                variant="iconCircular"
                                                style={styles.circleIconButton}
                                                onPress={handleAddLink}
                                                icon={<IMAGES.PlusButton />}
                                            />
                                            {links.length > 0 && (
                                                <Button 
                                                    variant="iconCircular"
                                                    style={styles.circleIconButton}
                                                    onPress={() => {
                                                        setIsAddingLink(false);
                                                        setCurrentLink('');
                                                    }}
                                                    icon={<IMAGES.XButton />}
                                                />
                                            )}
                                        </View>
                                    </View>
                                )}

                                {photos.map((photo, index) => (
                                    <View key={index} style={styles.imagePreviewContainer}>
                                        <Image source={photo} style={styles.imagePreview} />
                                        <Button 
                                            variant="iconCircular"
                                            style={styles.deleteImageBtn}
                                            onPress={() => removePhoto(index)}
                                            icon={<IMAGES.TrashButton />}
                                        />
                                    </View>
                                ))}

                                <View style={styles.bottomActions}>
                                    <Button
                                        variant="iconCircular"
                                        icon={<IMAGES.GalleryButton />}
                                    />

                                    <Button
                                        variant="iconCircular"
                                        icon={<IMAGES.SmileButton />}
                                    />

                                    <Button
                                        variant="primary"
                                        title="Публікація"
                                        icon={<IMAGES.HandButton />}
                                        iconPosition="right"
                                        style={styles.publishButton}
                                        textStyle={styles.publishButtonText}
                                    />
                                </View>
                            </ScrollView>

                            {scrollViewHeight < contentHeight && (
                                <View style={styles.customScrollTrack}>
                                    <Animated.View
                                        style={[
                                            styles.customScrollThumb,
                                            {
                                                height: SCROLL_THUMB_HEIGHT,
                                                transform: [{ translateY: scrollIndicatorPosition }]
                                            }
                                        ]}
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}