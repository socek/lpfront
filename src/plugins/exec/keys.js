const {
    psLookup
} = await imp('@src/utils.js')

const Key = await imp("@src/lp/key.js", true)
const {
    spawn
} = await imp("child_process")

const isProgramRunning = async(command) => {
    const result = await psLookup({
        command
    })
    return result.length > 0
}

export const startApplication = (index, {
    name,
    run,
    psname,
}) => {
    async function onClick() {
        const isRunning = await isProgramRunning(psname || run)
        if (!isRunning) {
            spawn(run, null, {
                detached: true
            })
            this.refresh()
        }
    }

    async function updateData() {
        const isRunning = await isProgramRunning(psname || run)
        if (isRunning) {
            return {
                "background": "green",
                "text": name,
            }
        }
        return {
            "background": "black",
            "text": name,
        }
    }

    return new Key(index, name, {
        updateData,
        onClick,
    })
}
