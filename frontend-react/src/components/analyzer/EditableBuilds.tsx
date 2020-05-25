import React from "react"
import AbilityButtons from "../user/AbilityButtons"
import ViewSlots from "../builds/ViewSlots"
import { Box, Flex } from "@chakra-ui/core"
import {
  Build,
  Ability,
  HeadOnlyAbility,
  ClothingOnlyAbility,
  ShoesOnlyAbility,
  StackableAbility,
} from "../../types"
import {
  headOnlyAbilities,
  clothingOnlyAbilities,
  shoesOnlyAbilities,
} from "../../utils/lists"
import Button from "../elements/Button"
import { FaPlus, FaMinus } from "react-icons/fa"

interface EditableBuildsProps {
  build: Partial<Build>
  otherBuild: Partial<Build>
  setBuild: React.Dispatch<React.SetStateAction<Partial<Build>>>
  showOther: boolean
  setShowOther: React.Dispatch<React.SetStateAction<boolean>>
  otherFocused: boolean
  changeFocus: () => void
}

const EditableBuilds: React.FC<EditableBuildsProps> = ({
  build,
  otherBuild,
  setBuild,
  showOther,
  setShowOther,
  otherFocused,
  changeFocus,
}) => {
  const buildToEdit = otherFocused ? otherBuild : build
  const handleChange = (value: Object) => setBuild({ ...buildToEdit, ...value })

  const handleAbilityButtonClick = (ability: Ability) => {
    if (headOnlyAbilities.indexOf(ability as any) !== -1) {
      if (buildToEdit.headgear![0] === "UNKNOWN") {
        handleChange({
          headgear: [
            ability,
            buildToEdit.headgear![1],
            buildToEdit.headgear![2],
            buildToEdit.headgear![3],
          ],
        })
      }
    } else if (clothingOnlyAbilities.indexOf(ability as any) !== -1) {
      if (buildToEdit.clothing![0] === "UNKNOWN") {
        handleChange({
          clothing: [
            ability,
            buildToEdit.clothing![1],
            buildToEdit.clothing![2],
            buildToEdit.clothing![3],
          ],
        })
      }
    } else if (shoesOnlyAbilities.indexOf(ability as any) !== -1) {
      if (buildToEdit.shoes![0] === "UNKNOWN") {
        handleChange({
          shoes: [
            ability,
            buildToEdit.shoes![1],
            buildToEdit.shoes![2],
            buildToEdit.shoes![3],
          ],
        })
      }
    } else {
      const headI = buildToEdit.headgear!.indexOf("UNKNOWN")
      if (headI !== -1) {
        const copy = buildToEdit.headgear!.slice()
        copy[headI] = ability as HeadOnlyAbility | StackableAbility
        handleChange({
          headgear: copy,
        })
        return
      }

      const clothingI = buildToEdit.clothing!.indexOf("UNKNOWN")
      if (clothingI !== -1) {
        const copy = buildToEdit.clothing!.slice()
        copy[clothingI] = ability as ClothingOnlyAbility | StackableAbility
        handleChange({
          clothing: copy,
        })
        return
      }

      const shoesI = buildToEdit.shoes!.indexOf("UNKNOWN")
      if (shoesI !== -1) {
        const copy = buildToEdit.shoes!.slice()
        copy[shoesI] = ability as ShoesOnlyAbility | StackableAbility
        handleChange({
          shoes: copy,
        })
      }
    }
  }

  const handleClickBuildAbility = (
    slot: "HEAD" | "CLOTHING" | "SHOES",
    index: number
  ) => {
    if (slot === "HEAD") {
      const copy = buildToEdit.headgear!.slice()
      copy[index] = "UNKNOWN"
      handleChange({
        headgear: copy,
      })
    } else if (slot === "CLOTHING") {
      const copy = buildToEdit.clothing!.slice()
      copy[index] = "UNKNOWN"
      handleChange({
        clothing: copy,
      })
    } else {
      const copy = buildToEdit.shoes!.slice()
      copy[index] = "UNKNOWN"
      handleChange({
        shoes: copy,
      })
    }
  }
  return (
    <>
      <Button
        icon={showOther ? FaMinus : FaPlus}
        onClick={() => setShowOther(!showOther)}
        mt="1em"
        mb="2em"
      >
        {showOther ? "Stop comparing" : "Compare"}
      </Button>
      <Flex justifyContent="space-evenly" flexWrap="wrap" mb="1em">
        <Flex flexDirection="column">
          {showOther && (
            <Button
              disabled={!otherFocused}
              color="orange"
              onClick={() => changeFocus()}
            >
              {!otherFocused ? "Editing" : "Edit"}
            </Button>
          )}
          <ViewSlots
            build={build}
            onAbilityClick={!otherFocused ? handleClickBuildAbility : undefined}
            m="1em"
            cursor={!otherFocused ? undefined : "not-allowed"}
          />
        </Flex>
        {showOther && (
          <Flex flexDirection="column">
            <Button
              disabled={otherFocused}
              color="blue"
              onClick={() => changeFocus()}
            >
              {otherFocused ? "Editing" : "Edit"}
            </Button>
            <ViewSlots
              build={otherBuild}
              onAbilityClick={
                otherFocused ? handleClickBuildAbility : undefined
              }
              m="1em"
              cursor={otherFocused ? undefined : "not-allowed"}
            />
          </Flex>
        )}
      </Flex>
      <Box mt="1em">
        <AbilityButtons
          onClick={(ability) => handleAbilityButtonClick(ability)}
        />
      </Box>
    </>
  )
}

export default EditableBuilds