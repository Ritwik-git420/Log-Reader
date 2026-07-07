## Log search Service file

const [searchTerm, setSearchTerm] = useState("");
const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);

searchTerm is the text typed into the search box.
currentMatchIndex tracks which search result we are currently on. lets say matches aray is - [12, 40, 99] ifcurrmidx is 1 that means user is at line number 40

useMEMO stops the rerenders and rerenders only when dependencies change