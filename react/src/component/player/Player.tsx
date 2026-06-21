import { Stack } from "@mui/material";
import Tile from "../tile/Tile";

export default function Player() {
    return (
        <Stack direction="row" spacing={2}>
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        </Stack>
    );
}