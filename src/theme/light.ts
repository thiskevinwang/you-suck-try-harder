import { Colors } from "consts/Colors"

const formInput = {
  background: Colors.silverLighter,
  borderColorBase: Colors.greyLighter,
  borderColorFocus: Colors.blackDarker,
  borderColorError: Colors.errorLight,
  color: Colors.blackDarker,
}

const formButton = {
  background: Colors.blackDarker,
  backgroundDisabled: Colors.silverLighter,
  backgroundHover: Colors.silverLighter,
  borderColorDisabled: Colors.greyLighter,
  color: Colors.silverLighter,
  colorHover: Colors.blackDarker,
}

const commentRenderer = {
  borderColor: Colors.greyLighter,
}

const lightTheme = {
  topAsideHeight: "2.5rem",
  headerHeight: "4rem",
  formInput,
  formButton,
  commentRenderer,
  background: Colors.silverLighter,
  colors: {
    main: Colors.blackDarker,
    contrast: Colors.silverLighter,
    error: Colors.errorLight,
    borderColor: Colors.greyLighter,
    leftSidebarNavBackground: Colors.silver,
    /**
     * - geistCyan for Light
     */
    highlight: Colors.geistCyan,
  },
}

export default lightTheme
