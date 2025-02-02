import {NavLink} from "react-router-dom";
import {styled} from "@mui/material";

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    textDecoration: "none",
    color: "inherit",
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
        backgroundColor:
            theme.palette.mode === "light"
                ? "rgba(50, 50, 0, 0.05)"
                : "rgba(50, 255, 255, 0.1)",
    },
    "&.active": {
        color: theme.palette.primary.main,
        fontWeight: "bold",
        borderBottom: `2px solid ${theme.palette.primary.main}`,
    },
}));

export default StyledNavLink;