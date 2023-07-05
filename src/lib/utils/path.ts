import type { BasicUnitInfoFragment } from "$lib/hygraph/graphql-types"

export function get_paths_for_units(
    units: BasicUnitInfoFragment[],
    container_el: HTMLElement,
    elements: Record<string, HTMLElement>,
): string[] {
    const paths: string[] = []
    units.map((unit, i) => {
        const next_sibling = units[i + 1]
        if (!next_sibling) return
        const current_el = elements[unit.slug]
        const next_sibling_el = elements[next_sibling.slug]
        if(!current_el || !next_sibling_el) return
        const current_top = parseInt(window.getComputedStyle(current_el).getPropertyValue("top").replace("px", ""))
        const next_sibling_top = parseInt(window.getComputedStyle(next_sibling_el).getPropertyValue("top").replace("px", ""))
        const current_rect = current_el.getBoundingClientRect()
        const next_sibling_rect = next_sibling_el.getBoundingClientRect()

        const startX = (current_rect.left + (current_rect.width / 2)) - container_el.getBoundingClientRect().left
        const startY = (current_rect.bottom) - container_el.getBoundingClientRect().top + 8 - current_top//for the box shadow
        const endX = (next_sibling_rect.left + (next_sibling_rect.width / 2)) - container_el.getBoundingClientRect().left
        const endY = next_sibling_rect.top - container_el.getBoundingClientRect().top -next_sibling_top//for the box shadow


        // if (current_el.style.top === "6px"){
        //     startY = startY - 6
        // }
        // if (window.getComputedStyle(next_sibling_el).top === "6px"){
        //     endY = endY - 6
        // }
        const intermediateX = startX
        const intermediateY = (endY + startY) / 2
        const path_data = `M ${startX} ${startY} L ${intermediateX} ${intermediateY} L ${endX} ${intermediateY} L ${endX} ${endY}`

        paths.push(roundPathCorners(path_data, 10, false))
    })

    return paths
}

type Point = {
    x: number
    y: number
}

type Command = (string|number)[] & Partial<{ origPoint: Point }>

function roundPathCorners(pathString: string, radius: number, useFractionalRadius: boolean) {
    function moveTowardsLength(movingPoint: Point, targetPoint: Point , amount: number) {
        const width = (targetPoint.x - movingPoint.x)
        const height = (targetPoint.y - movingPoint.y)

        const distance = Math.sqrt(width * width + height * height)

        return moveTowardsFractional(movingPoint, targetPoint, Math.min(1, amount / distance))
    }
    function moveTowardsFractional(movingPoint: Point, targetPoint: Point, fraction: number) {
        return {
            x: movingPoint.x + (targetPoint.x - movingPoint.x) * fraction,
            y: movingPoint.y + (targetPoint.y - movingPoint.y) * fraction
        }
    }

    // Adjusts the ending position of a command
    function adjustCommand(cmd: Command, newPoint: Point) {
        if (cmd.length > 2) {
            cmd[cmd.length - 2] = newPoint.x
            cmd[cmd.length - 1] = newPoint.y
        }
    }

    // Gives an {x, y} object for a command's ending position
    function pointForCommand(cmd: Command): Point {
        return {
            x: parseFloat(cmd[cmd.length - 2] as string),
            y: parseFloat(cmd[cmd.length - 1] as string),
        }
    }

    // Split apart the path, handing concatonated letters and numbers
    const pathParts: string[] = pathString
        .split(/[,\s]/)
        .reduce(function (parts, part) {
            const match = part.match("([a-zA-Z])(.+)")
            if (match) {
                parts.push(match[1])
                parts.push(match[2])
            } else {
                parts.push(part)
            }

            return parts
        }, [] as string[])

    // Group the commands with their arguments for easier handling
    const commands = pathParts.reduce(function (commands, part) {
        // if (parseFloat(part) == part && commands.length) {
        if (!isNaN(parseFloat(part)) && commands.length) {
            commands[commands.length - 1].push(part)
        } else {
            commands.push([part])
        }

        return commands
    }, [] as Command[])

    // The resulting commands, also grouped
    let resultCommands = []

    if (commands.length > 1) {
        const startPoint = pointForCommand(commands[0])

        // Handle the close path case with a "virtual" closing line
        let virtualCloseLine = null
        if (commands[commands.length - 1][0] == "Z" && commands[0].length > 2) {
            virtualCloseLine = ["L", startPoint.x, startPoint.y]
            commands[commands.length - 1] = virtualCloseLine
        }

        // We always use the first command (but it may be mutated)
        resultCommands.push(commands[0])

        for (let cmdIndex = 1; cmdIndex < commands.length; cmdIndex++) {
            const prevCmd = resultCommands[resultCommands.length - 1]

            const curCmd = commands[cmdIndex]

            // Handle closing case
            const nextCmd = (curCmd == virtualCloseLine)
                ? commands[1]
                : commands[cmdIndex + 1]

            // Nasty logic to decide if this path is a candidite.
            if (nextCmd && prevCmd && (prevCmd.length > 2) && curCmd[0] == "L" && nextCmd.length > 2 && nextCmd[0] == "L") {
                // Calc the points we're dealing with
                const prevPoint = pointForCommand(prevCmd)
                const curPoint = pointForCommand(curCmd)
                const nextPoint = pointForCommand(nextCmd)

                // The start and end of the cuve are just our point moved
                // towards the previous and next points, respectivly
                let curveStart, curveEnd

                if (useFractionalRadius) {
                    curveStart = moveTowardsFractional(curPoint, prevCmd.origPoint || prevPoint, radius)
                    curveEnd = moveTowardsFractional(curPoint, nextCmd.origPoint || nextPoint, radius)
                } else {
                    curveStart = moveTowardsLength(curPoint, prevPoint, radius)
                    curveEnd = moveTowardsLength(curPoint, nextPoint, radius)
                }

                // Adjust the current command and add it
                adjustCommand(curCmd, curveStart)
                curCmd.origPoint = curPoint
                resultCommands.push(curCmd)

                // The curve control points are halfway between the start/end of the curve and
                // the original point
                const startControl = moveTowardsFractional(curveStart, curPoint, .5)
                const endControl = moveTowardsFractional(curPoint, curveEnd, .5)

                // Create the curve
                const curveCmd = ["C", startControl.x, startControl.y, endControl.x, endControl.y, curveEnd.x, curveEnd.y] as Command
                // Save the original point for fractional calculations
                curveCmd.origPoint = curPoint
                resultCommands.push(curveCmd)
            } else {
                // Pass through commands that don't qualify
                resultCommands.push(curCmd)
            }
        }

        // Fix up the starting point and restore the close path if the path was orignally closed
        if (virtualCloseLine) {
            const newStartPoint = pointForCommand(resultCommands[resultCommands.length - 1])
            resultCommands.push(["Z"])
            adjustCommand(resultCommands[0], newStartPoint)
        }
    } else {
        resultCommands = commands
    }

    return resultCommands.reduce(function (str, c) { return str + c.join(" ") + " " }, "")
}