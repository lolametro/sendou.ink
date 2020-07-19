import { useQuery } from "@apollo/client"
import { Box, Flex, Heading, Image } from "@chakra-ui/core"
import { Link } from "@reach/router"
import React, { useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import { FiClock, FiEdit, FiInfo } from "react-icons/fi"
import { CompetitiveFeedEvent } from "../../graphql/queries/upcomingEvents"
import { USER } from "../../graphql/queries/user"
import MyThemeContext from "../../themeContext"
import { UserData } from "../../types"
import Section from "../common/Section"
import UserAvatar from "../common/UserAvatar"
import Button from "../elements/Button"
import Markdown from "../elements/Markdown"
import TournamentModal from "./TournamentModal"

interface TournamentInfoProps {
  tournament: CompetitiveFeedEvent
  date: Date
  expandedByDefault?: boolean
}

const TournamentInfo: React.FC<TournamentInfoProps> = ({
  tournament,
  date,
  expandedByDefault,
}) => {
  const { themeColorWithShade, grayWithShade } = useContext(MyThemeContext)
  const { t, i18n } = useTranslation()
  const [expanded, setExpanded] = useState(!!expandedByDefault)
  const [showModal, setShowModal] = useState(false)
  const poster = tournament.poster_discord_user

  const { data: userData } = useQuery<UserData>(USER)

  return (
    <Section my="1rem" w="48rem">
      {showModal && (
        <TournamentModal
          competitiveFeedEvent={tournament}
          closeModal={() => setShowModal(false)}
        />
      )}
      <>
        <Heading fontFamily="'Rubik', sans-serif" size="lg">
          {tournament.name}
        </Heading>
        <Flex alignItems="center" color={grayWithShade}>
          <Box as={FiClock} mr="0.5em" color={themeColorWithShade} />
          {date.toLocaleString(i18n.language, {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </Flex>

        <Flex alignItems="center" color={grayWithShade} my="0.5em">
          {poster.avatar && (
            <Box mr="0.5em">
              <UserAvatar
                name={poster.username}
                src={poster.avatar}
                size="sm"
              />
            </Box>
          )}{" "}
          <Link to={`/u/${poster.discord_id}`}>
            <Box>
              {poster.username}#{poster.discriminator}
            </Box>
          </Link>
        </Flex>

        <Flex flexWrap="wrap" mt="1em">
          <Box mr="1em">
            <a href={tournament.discord_invite_url}>
              <Button outlined icon={"discord" as any} width="150px">
                {t("calendar;Join Discord")}
              </Button>
            </a>
          </Box>
          <Box mr="1em">
            <Button
              outlined={expanded}
              onClick={() => setExpanded(!expanded)}
              width="150px"
              icon={FiInfo}
            >
              {expanded ? t("calendar;Hide info") : t("calendar;Show info")}
            </Button>
          </Box>
          {userData?.user?.discord_id === poster.discord_id && (
            <Button
              icon={FiEdit}
              width="150px"
              onClick={() => setShowModal(true)}
            >
              {t("calendar;Edit")}
            </Button>
          )}
        </Flex>
        {expanded && (
          <Box mt="1rem">
            <Markdown value={tournament.description} />
            {tournament.picture_url && (
              <Image
                borderRadius="5px"
                maxH="500px"
                src={tournament.picture_url}
              />
            )}
          </Box>
        )}
      </>
    </Section>
  )
}

export default TournamentInfo
