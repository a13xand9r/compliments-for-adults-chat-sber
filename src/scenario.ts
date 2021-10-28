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
import { complimentHandler, noMatchHandler, runAppHandler, thanksHandler } from './handlers'
import model from './intents.json'
// require('dotenv').config()

const storage = new SaluteMemoryStorage()
const intents = createIntents(model.intents)
const { match, intent } = createMatchers<SaluteRequest, typeof intents>()

const userScenario = createUserScenario({
    Compliment: {
        match: req => {
            console.log(req.message.original_text)
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