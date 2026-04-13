import React, { useRef, useState } from 'react';
import { View, TextInput } from 'react-native';
import { styles } from './numberButton.styles';

interface Props {
    onComplete: (code: string) => void;
}

export function NumberButton({ onComplete }: Props) {
    const [d, setD] = useState(['', '', '', '', '', '']);
    const r = useRef<Array<TextInput | null>>([]);

    const set = (text: string, i: number) => {
        const next = [...d];
        next[i] = text.slice(-1);
        setD(next);
        if (text && i < 5) r.current[i + 1]?.focus();
        if (next.every(x => x !== '')) onComplete(next.join(''));
    };

    const back = (key: string, i: number) => {
        if (key === 'Backspace' && !d[i] && i > 0) r.current[i - 1]?.focus();
    };

    return (
        <View style={styles.row}>
            <View style={styles.pair}>
                <TextInput ref={el => { r.current[0] = el; }} style={styles.box} value={d[0]} keyboardType="number-pad" maxLength={1} onChangeText={t => set(t, 0)} onKeyPress={e => back(e.nativeEvent.key, 0)} />
                <TextInput ref={el => { r.current[1] = el; }} style={styles.box} value={d[1]} keyboardType="number-pad" maxLength={1} onChangeText={t => set(t, 1)} onKeyPress={e => back(e.nativeEvent.key, 1)} />
            </View>
            <View style={styles.pair}>
                <TextInput ref={el => { r.current[2] = el; }} style={styles.box} value={d[2]} keyboardType="number-pad" maxLength={1} onChangeText={t => set(t, 2)} onKeyPress={e => back(e.nativeEvent.key, 2)} />
                <TextInput ref={el => { r.current[3] = el; }} style={styles.box} value={d[3]} keyboardType="number-pad" maxLength={1} onChangeText={t => set(t, 3)} onKeyPress={e => back(e.nativeEvent.key, 3)} />
            </View>
            <View style={styles.pair}>
                <TextInput ref={el => { r.current[4] = el; }} style={styles.box} value={d[4]} keyboardType="number-pad" maxLength={1} onChangeText={t => set(t, 4)} onKeyPress={e => back(e.nativeEvent.key, 4)} />
                <TextInput ref={el => { r.current[5] = el; }} style={styles.box} value={d[5]} keyboardType="number-pad" maxLength={1} onChangeText={t => set(t, 5)} onKeyPress={e => back(e.nativeEvent.key, 5)} />
            </View>
        </View>
        
    );
}
