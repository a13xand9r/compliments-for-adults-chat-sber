import { SaluteHandler } from '@salutejs/scenario'
import * as dictionary from './system.i18n'
import { addSSML, changeAppealText, getUniqCompliment } from './utils/utils'

export const runAppHandler: SaluteHandler = ({ req, res, session }, dispatch) => {
    session.oldCompliments = []
    dispatch && dispatch(['Hello'])
}

export const noMatchHandler: SaluteHandler = ({ req, res }) => {
    const keyset = req.i18n(dictionary)
    res.setPronounceText(keyset('404'))
    res.appendBubble(keyset('404'))
}

export const helloHandler: SaluteHandler = ({ req, res }) => {
    const keyset = req.i18n(dictionary)
    const responseText = keyset('Привет')
    res.setPronounceText(responseText)
    res.appendBubble(responseText)
    res.setAutoListening(true)
    res.appendSuggestions(['Да', 'Хватит'])
}

export const complimentHandler: SaluteHandler = ({ req, res, session }) => {
    // if (!session.oldCompliments) session.oldCompliments = []
    const {compliment, complimentId} = getUniqCompliment(session.oldCompliments as number[])
    const complimentMessage = changeAppealText(compliment, req.request.payload.character.appeal)
    //@ts-ignore
    session.oldCompliments.push(complimentId)
    if (compliment){
        res.setPronounceText(`<speak>${addSSML(complimentMessage)}</speak>`, {ssml: true})
        res.appendBubble(complimentMessage)
        res.appendSuggestions(['Ещё', 'Хватит'])
    } else {
        res.setPronounceText('На сегодня у меня закончились комплименты')
        res.appendBubble('На сегодня у меня закончились комплименты')
    }
}

export const thanksHandler: SaluteHandler = ({ req, res }) => {
    const keyset = req.i18n(dictionary)

    const responseText = keyset('Спасибо')
    res.setPronounceText(responseText)
    res.appendBubble(responseText)
    res.appendSuggestions(['Ещё', 'Хватит'])
}


