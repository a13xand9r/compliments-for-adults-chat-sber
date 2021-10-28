import { SmartAppBrainRecognizer } from '@salutejs/recognizer-smartapp-brain'
import {
    createIntents,
    createMatchers,
    createSaluteRequest,
    createSaluteResponse,
    createScenarioWalker,
    createSystemScenario,
    createUserScenario,
    NLPRequest,
    NLPResponse,
    SaluteRequest
} from '@salutejs/scenario'
import { SaluteMemoryStorage } from '@salutejs/storage-adapter-memory'
import { complimentHandler, helloHandler, noMatchHandler, runAppHandler, thanksHandler } from './handlers'
import model from './intents.json'
// require('dotenv').config()

const storage = new SaluteMemoryStorage()
const intents = createIntents(model.intents)
const { text } = createMatchers<SaluteRequest, typeof intents>()

const userScenario = createUserScenario({
    Hello: {
        match: text('привет'),
        handle: helloHandler,
        children: {
            Yes: {
                match: req => text('да')(req) || text('начнем')(req),
                handle: ({req, res}, dispatch) => {
                    dispatch && dispatch(['Compliment'])
                }
            },
            No: {
                match: text('нет'),
                handle: ({res}) => {
                    res.appendBubble('Ну и ладно')
                    res.setPronounceText('Ну и ладно')
                    res.finish()
                }
            }
        }
    },
    Compliment: {
        match: req => {
            return req.message.original_text.toLowerCase().includes('еще') || req.message.original_text.toLowerCase().includes('дальше') || req.message.original_text.toLowerCase().includes('ещё')
        },
        handle: complimentHandler
    },
    Thanks: {
        match: req => {
            return req.message.original_text.toLowerCase().includes('спасибо') || req.message.original_text.toLowerCase().includes('благодарю')
        },
        handle: thanksHandler
    },
})

const systemScenario = createSystemScenario({
    RUN_APP: runAppHandler,
    NO_MATCH: noMatchHandler
})

const scenarioWalker = createScenarioWalker({
    systemScenario,
    userScenario
})

export const handleNlpRequest = async (request: NLPRequest): Promise<NLPResponse> => {
    const req = createSaluteRequest(request)
    const res = createSaluteResponse(request)
    const sessionId = request.uuid.sub
    const session = await storage.resolve(sessionId)
    await scenarioWalker({ req, res, session })

    await storage.save({ id: sessionId, session })

    return res.message
}