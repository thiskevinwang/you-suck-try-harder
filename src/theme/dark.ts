import { Colors } from "consts/Colors"

const formInput = {
  background: Colors.black,
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
  background: Colors.blackDark,
  colors: {
    body: Colors.blackLight,
    borderColor: Colors.greyDarker,
    contrast: Colors.blackDarker,
    error: Colors.errorDark,
    header: Colors.blackDark,
    highlight: Colors.geistPurple,
    leftSidebarNavBackground: Colors.black,
    main: Colors.silverLighter,
  },
  commentRenderer,
  formButton,
  formInput,
  headerHeight: "4rem",
  topAsideHeight: "2.5rem",
}

export default darkTheme
