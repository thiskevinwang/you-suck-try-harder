import { Colors } from "consts/Colors"

enum formInput {
  background = Colors.blackDarker,
  borderColorBase = Colors.greyDarker,
  borderColorFocus = Colors.silverLighter,
  borderColorError = Colors.errorDark,
  color = Colors.silverLighter,
}

enum formButton {
  background = Colors.silverLighter,
  backgroundDisabled = Colors.blackDarker,
  backgroundHover = Colors.blackDarker,
  borderColorDisabled = Colors.greyDarker,
  color = Colors.blackDarker,
  colorHover = Colors.silverLighter,
}

enum commentRenderer {
  borderColor = Colors.greyDarker,
}

const darkTheme = {
  headerHeight: "40px",
  formInput,
  formButton,
  commentRenderer,
  background: Colors.blackDarker,
  colors: {
    main: Colors.silverLighter,
    contrast: Colors.blackDarker,
    error: Colors.errorDark,
    borderColor: Colors.greyDarker,
    leftSidebarNavBackground: Colors.blackDark,
  },
}

export default darkTheme
