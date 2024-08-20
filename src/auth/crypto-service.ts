import crypto from 'crypto'

enum AlphabetOrderType {
    LoverCase,
    UpperCase,
    Number,
    SpecialCharacter
}

const CryptoService = (() => {
    const createPasswordHash = (password: string) => {
        return crypto.createHmac('sha256', password).digest('hex')
    }

    // compare plain-text password and hash
    const comparePasswords = (password: string, hash: string) => {
        return createPasswordHash(password) == hash
    }

    const createResetToken = () => {
        const resetTokenValue = crypto.randomBytes(20).toString("base64url");
        const resetTokenSecret = crypto.randomBytes(10).toString("hex")
        return {resetTokenValue, resetTokenSecret}
    }

    const alphabets = [
        {
            type: AlphabetOrderType.LoverCase,
            length: 26,
            alphabet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        },
        {
            type: AlphabetOrderType.UpperCase,
            length: 26,
            alphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        },
        {
            type: AlphabetOrderType.Number,
            length: 10,
            alphabet: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        },
        {
            type: AlphabetOrderType.SpecialCharacter,
            length: 31,
            alphabet: ['!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', ']', '^', '_', '`', '{', '|', '}', '~'],
        }
    ]

    const calculateEntropy = (str: string) => {
        let L = 0
        const strArr = Array.from(str)
        const usedAlpas = new Set<AlphabetOrderType>()
        for (const set of alphabets) {
            if (strArr.some(c => set.alphabet.includes(c))) {
                L += set.length
                usedAlpas.add(set.type)
            }
        }
        return {
            entropy: Math.log2(Math.pow(L, str.length)),
            alphabetLength: L,
            alphabetsUsed: usedAlpas
        }
    }

    return  {
        createPasswordHash,
        comparePasswords,
        createResetToken,
        calculateEntropy
    }
})()

export default CryptoService
