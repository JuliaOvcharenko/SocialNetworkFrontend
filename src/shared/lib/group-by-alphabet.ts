import { IUser } from "@modules/friends/api/friend.types";


export const groupUsersByAlphabet = (users: IUser[], searchQuery: string) => {
    const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name));

    return sorted.reduce((acc, user) => {
        const firstLetter = user.name.charAt(0).toUpperCase();
        const existingSection = acc.find(section => section.title === firstLetter);

        if (existingSection) {
            existingSection.data.push(user);
        } else {
            acc.push({ title: firstLetter, data: [user] });
        }
        return acc;
    }, [] as { title: string, data: IUser[] }[]);
};