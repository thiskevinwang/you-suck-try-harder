import { Colors } from "consts/Colors"

enum formInput {
  background = Colors.silverLighter,
  borderColorBase = Colors.greyLighter,
  borderColorFocus = Colors.blackDarker,
  borderColorError = Colors.errorLight,
  color = Colors.blackDarker,
}

enum formButton {
  background = Colors.blackDarker,
  backgroundDisabled = Colors.silverLighter,
  backgroundHover = Colors.silverLighter,
  borderColorDisabled = Colors.greyLighter,
  color = Colors.silverLighter,
  colorHover = Colors.blackDarker,
}

enum commentRenderer {
  borderColor = Colors.greyLighter,
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
  },
}

export default lightTheme
