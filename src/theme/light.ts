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
  background: Colors.silverLighter,
  colors: {
    body: Colors.silverLighter,
    borderColor: Colors.greyLighter,
    contrast: Colors.silverLighter,
    error: Colors.errorLight,
    /**
     * - geistCyan for Light
     */
    highlight: Colors.geistCyan,
    leftSidebarNavBackground: Colors.silver,
    main: Colors.blackDarker,
  },
  commentRenderer,
  formButton,
  formInput,
  headerHeight: "4rem",
  topAsideHeight: "2.5rem",
}

export default lightTheme
