var m_hoverElem = null;

function hover_enter(e) {
    source = e.target;
    
    e.stopPropagation();
    if (m_hoverElem != null)
        m_hoverElem.classList.remove('a-hover');
    m_hoverElem = source;
    m_hoverElem.classList.add('a-hover');
    document.body.styling.color = "grey";
}

function hover_exit(e) {
    source = e.target;
    e.stopPropagation();
    source.classList.remove('a-hover');
    document.body.styling.color = "white";
}