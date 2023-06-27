import Router from "./Router";
import { GlobalStyled } from "./Global";
import { ReactQueryDevtools } from "react-query/devtools";
import { ThemeProvider } from "styled-components";
import { lighttheme, darktheme } from "./theme";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "./atoms";
import { FcNightLandscape } from "react-icons/fc";
import { BsFillCloudSunFill } from "react-icons/bs";
import styled from "styled-components";
import { useSetRecoilState } from "recoil";
interface IisDark {
  isDark: boolean;
}
const ToggleBtn = styled.div<IisDark>`
  * {
    width: 30px;
    height: 30px;
  }
  position: fixed;
  top: 350px;
  left: 30px;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  box-shadow: 0px 0px 5px ${(props) => props.theme.accentColor};
  &:hover {
    transform: scale(1.1);
  }
  transition: all 0.2s ease-in-out;
`;
function App() {
  const isDark = useRecoilValue(isDarkAtom);
  const setterDarkAtom = useSetRecoilState(isDarkAtom);
  return (
    <>
      <ThemeProvider theme={isDark ? darktheme : lighttheme}>
        <GlobalStyled />
        <Router></Router>
        <ToggleBtn
          isDark={useRecoilValue(isDarkAtom)}
          onClick={() => setterDarkAtom((current) => !current)}
        >
          {useRecoilValue(isDarkAtom) ? (
            <BsFillCloudSunFill />
          ) : (
            <FcNightLandscape />
          )}
        </ToggleBtn>
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </>
  );
}
export default App;
