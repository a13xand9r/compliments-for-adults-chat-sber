import { SaluteHandler } from '@salutejs/scenario'
import * as dictionary from './system.i18n'
import { changeAppealText, getUniqCompliment } from './utils/utils'

export const runAppHandler: SaluteHandler = ({ req, res, session }, dispatch) => {
    session.oldCompliments = []
    dispatch && dispatch(['Compliment'])
}

export const noMatchHandler: SaluteHandler = ({ req, res }) => {
    const keyset = req.i18n(dictionary)
    res.setPronounceText(keyset('404'))
    res.appendBubble(keyset('404'))
}

export const complimentHandler: SaluteHandler = ({ req, res, session }) => {
    if (!session.oldCompliments) session.oldCompliments = []
    const compliment = changeAppealText(getUniqCompliment(session.oldCompliments as string[]), req.request.payload.character.appeal)
    if (compliment){
        //@ts-ignore
        session.oldCompliments.push(compliment)
        res.setPronounceText(compliment)
        res.appendBubble(compliment)
        res.appendSuggestions(['Ещё', 'Хватит'])
    } else {
        res.setPronounceText('На сегодня у меня закончились комплименты')
        res.appendBubble('На сегодня у меня закончились комплименты')
    }
}

export const thanksHandler: SaluteHandler = ({ req, res, session }) => {
    const keyset = req.i18n(dictionary)
    res.setPronounceText(keyset('Спасибо'))
    res.appendBubble(keyset('Спасибо'))
    res.appendSuggestions(['Ещё', 'Хватит'])
}


