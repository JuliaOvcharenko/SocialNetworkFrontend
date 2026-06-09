import { IUser } from "@modules/friends/api/friend.types";

export const groupUsersByAlphabet = (users: IUser[], searchQuery: string) => {
    const filtered = users.filter(user => {
        const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
        return fullName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const sorted = filtered.sort((a, b) => {
        const nameA = `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim();
        const nameB = `${b.firstName ?? ""} ${b.lastName ?? ""}`.trim();
        return nameA.localeCompare(nameB);
    });

    return sorted.reduce((acc, user) => {
        const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
        const firstLetter = fullName.charAt(0).toUpperCase() || "#";
        const existingSection = acc.find(section => section.title === firstLetter);

        if (existingSection) {
            existingSection.data.push(user);
        } else {
            acc.push({ title: firstLetter, data: [user] });
        }
        return acc;
    }, [] as { title: string; data: IUser[] }[]);
};