import {styled} from "@mui/material/styles";
import {Card, Container} from "@mui/material";

const StyledAccount = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2.5),
}));

export default function GameCard(props) {

    return(
        <Container>
            <Card>s</Card>
        </Container>
    )
}