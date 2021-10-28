import { Character } from '@salutejs/scenario';
import { compliments } from './compliments';

export function getRandomFromArray<T>(arr: T[]): T {
    return arr[Math.floor(arr.length * Math.random())]
}

export function getUniqCompliment(oldCompliments: string[]) {
    let compliment = getRandomFromArray(compliments)
    let foundCompliment = oldCompliments.find(item => item === compliment)
    let count = 0

    while (foundCompliment && count < compliments.length * 6) {
        count++
        compliment = getRandomFromArray(compliments)
        foundCompliment = oldCompliments.find(item => item === compliment)
        console.log(count)
    }
    return compliment
}

// const youObjNoOfficial = {
//     'Ваш': 'Твой',
//     'Вашего': 'Твоего',
//     'Вас': 'Тебя',
// }
const youObjOfficial = {
    'Ты': 'Вы',
    'Твой': 'Ваш',
    'Твоего': 'Вашего',
    'Тебя': 'Вас',
    'Тобой': 'Вами',
    'Твоё': 'Ваше',
    'Твои': 'Ваши',
    'Тебе': 'Вам',
    'В тебе': 'В вас',
    'Твоему': 'Вашему',
    'Позволь': 'Позвольте',
    'Выглядишь': 'Выглядите',
    'Вызываешь': 'Вызываете',
    'Знаешь': 'Знаете',
    'Затрагиваешь': 'Затрагиваете',
}

export function changeAppealText(text: string, appeal: Character['appeal']): string {
    let keys: string[]
    let newText: string = text
    if (appeal === 'official') {
        keys = Object.keys(youObjOfficial)
        keys.forEach((key) => {
            if (text.toLowerCase().includes(key.toLowerCase())) {
                //@ts-ignore
                newText = text.replace(key, youObjOfficial[key])
                //@ts-ignore
                newText = newText.replace(key.toLowerCase(), youObjOfficial[key].toLowerCase())
            }
        })
    }
    return newText
}

