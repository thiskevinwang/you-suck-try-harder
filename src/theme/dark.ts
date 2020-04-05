import { Colors } from "consts/Colors"

const formInput = {
  background: Colors.blackDarker,
  borderColorBase: Colors.greyDarker,
  borderColorFocus: Colors.silverLighter,
  borderColorError: Colors.errorDark,
  color: Colors.silverLighter,
}

const formButton = {
  background: Colors.silverLighter,
  backgroundDisabled: Colors.blackDarker,
  backgroundHover: Colors.blackDarker,
  borderColorDisabled: Colors.greyDarker,
  color: Colors.blackDarker,
  colorHover: Colors.silverLighter,
}

const commentRenderer = {
  borderColor: Colors.greyDarker,
}

const darkTheme = {
  topAsideHeight: "2.5rem",
  headerHeight: "4rem",
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
