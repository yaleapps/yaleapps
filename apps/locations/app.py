import streamlit as st

# Set the page layout
st.set_page_config(layout="wide")

# Title of the landing page
st.title("Welcome to the Post-Graduation Location Survey")

# Description of the project
st.markdown(
    """
### Hey there, Class of 2024! 🎓
Welcome to the Post-Graduation Location Survey app. This platform is designed to help you share your post-graduation plans and stay connected with your classmates.
Pages:
"""
)


if st.button("New Response"):
    st.switch_page("pages/new_response.py")

if st.button("Edit Response"):
    st.switch_page("pages/edit_response.py")

if st.button("Group People by Cities"):
    st.switch_page("pages/group_people_by_cities.py")

if st.button("View Map"):
    st.switch_page("pages/view_map.py")


st.markdown(
    """Your participation is completely optional but greatly appreciated. Let's stay connected and see where the future takes us!"""
)
