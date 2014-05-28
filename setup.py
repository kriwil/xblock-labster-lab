"""Setup for labster_lab XBlock."""

import os
from setuptools import setup


def package_data(pkg, root):
    """Generic function to find package_data for `pkg` under `root`."""
    data = []
    for dirname, _, files in os.walk(os.path.join(pkg, root)):
        for fname in files:
            data.append(os.path.relpath(os.path.join(dirname, fname), pkg))

    return {pkg: data}


setup(
    name='labster_lab-xblock',
    version='0.1',
    description='labster_lab XBlock',   # TODO: write a better description.
    packages=[
        'labster_lab',
    ],
    install_requires=[
        'XBlock',
    ],
    entry_points={
        'xblock.v1': [
            'labster_lab = labster_lab:LabsterLabXBlock',
        ]
    },
    package_data=package_data("labster_lab", "static"),
)