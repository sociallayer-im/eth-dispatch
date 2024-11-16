const avatars = [
    '/avatars/avatar_1.jpg',
    '/avatars/avatar_2.jpg',
    '/avatars/avatar_3.jpg',
]

export const getAvatar = (address?: string) => {
    if (address) {
        const num = parseInt(address.slice(-1), 16)
        return avatars[num % avatars.length]
    } else {
        const index = Math.floor(Math.random() * avatars.length)
        return avatars[index]
    }
}
